using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace MedicalVaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly ILogger<InquiriesController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public InquiriesController(
        ILogger<InquiriesController> logger,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    private static readonly List<Inquiry> _sampleInquiries = new()
    {
        new Inquiry(Guid.NewGuid(), "Alice", "alice@example.com", "I'd like to know more about your services."),
        new Inquiry(Guid.NewGuid(), "Bob", "bob@example.com", "How do I reset my password?")
    };

    [HttpGet]
    public ActionResult<IEnumerable<Inquiry>> Get()
    {
        return Ok(_sampleInquiries);
    }

    [HttpGet("{id:guid}")]
    public ActionResult<Inquiry> Get(Guid id)
    {
        var inquiry = _sampleInquiries.FirstOrDefault(i => i.Id == id);
        if (inquiry is null)
            return NotFound();

        return Ok(inquiry);
    }

    [HttpPost]
    public IActionResult Post([FromBody] InquiryRequest request)
    {
        _logger.LogInformation("Received inquiry: {Name} {Email} {Message}", request.Name, request.Email, request.Message);

        var inquiry = new Inquiry(Guid.NewGuid(), request.Name, request.Email, request.Message);
        _sampleInquiries.Add(inquiry);

        return CreatedAtAction(nameof(Get), new { id = inquiry.Id }, new InquiryResponse(inquiry.Id, inquiry.Name, inquiry.Email, inquiry.Message, "Thanks! We have received your message and will follow up shortly."));
    }

    [HttpPost("scheduling")]
    public async Task<IActionResult> SubmitScheduling([FromBody] SchedulingRequest request)
    {
        _logger.LogInformation("Received scheduling request for {Email}", request.Email);

        var payload = new
        {
            formType = "scheduling",
            name = request.Name,
            email = request.Email,
            message = request.Message,
            preferredDate = request.StartTime,
            preferredTime = request.EndTime,
            serviceType = request.CalendarProvider
        };

        await SendToGoogleScript(payload);

        return Ok(new SubmissionResponse("Thanks! Your scheduling request has been received. We will send a confirmation message to your email."));
    }

    [HttpPost("billing")]
    public async Task<IActionResult> SubmitBilling([FromBody] BillingRequest request)
    {
        _logger.LogInformation("Received billing support request for {Email}", request.Email);

        var payload = new
        {
            formType = "billing",
            name = request.Name,
            email = request.Email,
            message = request.Message,
            accountRef = request.Reference
        };

        await SendToGoogleScript(payload);

        return Ok(new SubmissionResponse("Thanks! Your billing support request has been received. We will send a confirmation message to your email."));
    }

    private async Task SendToGoogleScript(object payload)
    {
        var scriptUrl = _configuration["GoogleScript:Url"] ?? _configuration["GOOGLE_SCRIPT_URL"];

        if (string.IsNullOrWhiteSpace(scriptUrl))
        {
            _logger.LogWarning("GOOGLE_SCRIPT_URL is not configured; skipping email notification.");
            return;
        }

        try
        {
            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(scriptUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError("Google Script email notification failed: {Status} {Body}", response.StatusCode, body);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Google Script for email notification");
        }
    }

    [HttpPut("{id:guid}")]
    public IActionResult Put(Guid id, [FromBody] InquiryRequest request)
    {
        var index = _sampleInquiries.FindIndex(i => i.Id == id);
        if (index == -1)
            return NotFound();

        _sampleInquiries[index] = new Inquiry(id, request.Name, request.Email, request.Message);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        var removed = _sampleInquiries.RemoveAll(i => i.Id == id);
        if (removed == 0)
            return NotFound();

        return NoContent();
    }

    public record Inquiry(Guid Id, string Name, string Email, string Message);

    public record InquiryRequest(string Name, string Email, string Message);

    public record SchedulingRequest(string Name, string Email, string Message, string? CalendarProvider, string? StartTime, string? EndTime, string? Timezone);

    public record BillingRequest(string Name, string Email, string Message, string? Reference, string? Amount, string? Topic);

    public record InquiryResponse(Guid Id, string Name, string Email, string Message, string ConfirmationMessage);

    public record SubmissionResponse(string ConfirmationMessage);
}