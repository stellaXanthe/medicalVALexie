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
            return Problem(detail: "Langflow URL is not configured.", statusCode: 500);

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
            return Problem(detail: "Failed to call Langflow API.", statusCode: 502);
        }
    }
}
