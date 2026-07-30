using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace MedicalVaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LangflowController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LangflowController> _logger;

    public LangflowController(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<LangflowController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public record LangflowRequest(string Message);
    public record LangflowResponse(string Reply);

    [HttpPost]
    public async Task<ActionResult<LangflowResponse>> Post([FromBody] LangflowRequest request)
    {
        var langflowUrl = _configuration["Langflow:Url"] ?? _configuration["LANGFLOW_URL"];
        if (string.IsNullOrWhiteSpace(langflowUrl))
            return Ok(new LangflowResponse(BuildFallbackReply(request.Message)));

        var apiKey = _configuration["Langflow:ApiKey"] ?? _configuration["LANGFLOW_API_KEY"];

        var client = _httpClientFactory.CreateClient();

        var payload = new
        {
            // Adjust this payload to match your Langflow setup
            input = request.Message,
        };

        var requestContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        }

        try
        {
            var response = await client.PostAsync(langflowUrl.TrimEnd('/') + "/api/v1/predict", requestContent);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);

            // Try to extract the most user-friendly reply from common Langflow response structures
            string? reply = null;

            if (doc.RootElement.TryGetProperty("output", out var output))
            {
                if (output.ValueKind == JsonValueKind.String)
                    reply = output.GetString();
                else if (output.ValueKind == JsonValueKind.Array && output.GetArrayLength() > 0)
                    reply = output[0].GetString();
            }

            if (string.IsNullOrWhiteSpace(reply) && doc.RootElement.TryGetProperty("result", out var result))
            {
                if (result.ValueKind == JsonValueKind.String)
                    reply = result.GetString();
                else if (result.ValueKind == JsonValueKind.Array && result.GetArrayLength() > 0)
                    reply = result[0].GetString();
            }

            if (string.IsNullOrWhiteSpace(reply))
            {
                // Fall back to the raw response if we can't find a clear text field
                reply = doc.RootElement.ToString();
            }

            return Ok(new LangflowResponse(reply));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Langflow integration failed");
            return Ok(new LangflowResponse(BuildFallbackReply(request.Message)));
        }
    }

    private static string BuildFallbackReply(string? message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return "Thanks for reaching out. I can help with services, HIPAA support, onboarding, or next steps for your practice.";

        var normalized = message.Trim().ToLowerInvariant();

        if (normalized.Contains("hipaa") || normalized.Contains("compliant") || normalized.Contains("secure"))
            return "Yes — our assistants are HIPAA-trained and follow secure, compliant workflows for medical practices.";

        if (normalized.Contains("price") || normalized.Contains("cost") || normalized.Contains("pricing"))
            return "Pricing depends on the volume and scope of support you need. We can tailor a plan for your workflow and budget.";

        if (normalized.Contains("service") || normalized.Contains("assist") || normalized.Contains("support"))
            return "We can support scheduling, follow-up calls, insurance coordination, intake tasks, and day-to-day administrative work.";

        if (normalized.Contains("start") || normalized.Contains("onboard") || normalized.Contains("begin"))
            return "Getting started is simple. We can review your workflow, recommend the right support, and outline a smooth onboarding plan.";

        return "Thanks for reaching out. I can help with services, HIPAA support, onboarding, or next steps for your practice.";
    }
}
