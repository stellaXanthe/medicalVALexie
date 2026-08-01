using MedicalVaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalVaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly ILogger<InquiriesController> _logger;
    private readonly IMakeWebhookService _makeWebhookService;

    public InquiriesController(ILogger<InquiriesController> logger, IMakeWebhookService makeWebhookService)
    {
        _logger = logger;
        _makeWebhookService = makeWebhookService;
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
    public async Task<IActionResult> Post([FromBody] InquiryRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Received inquiry: {Name} {Email} {Message}", request.Name, request.Email, request.Message);

        var inquiry = new Inquiry(Guid.NewGuid(), request.Name, request.Email, request.Message);
        _sampleInquiries.Add(inquiry);

        var payload = new MakeWebhookPayload
        {
            InquiryType = "contact",
            UserEmail = request.Email,
            UserName = request.Name,
            OwnerEmail = "owner@yourdomain.com",
            Subject = "Contact us request",
            Message = request.Message,
        };

        await _makeWebhookService.SendAsync(payload, cancellationToken);

        return CreatedAtAction(nameof(Get), new { id = inquiry.Id }, new InquiryResponse(inquiry.Id, inquiry.Name, inquiry.Email, inquiry.Message, "Thanks! We have received your message and will follow up shortly."));
    }

    [HttpPost("scheduling")]
    public async Task<IActionResult> SubmitScheduling([FromBody] SchedulingRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Received scheduling request for {Email}", request.Email);

        var payload = new MakeWebhookPayload
        {
            InquiryType = "scheduling",
            CalendarProvider = request.CalendarProvider ?? "google",
            UserEmail = request.Email,
            UserName = request.Name,
            OwnerEmail = "owner@yourdomain.com",
            Subject = "Scheduling request",
            Message = request.Message,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Timezone = request.Timezone,
        };

        await _makeWebhookService.SendAsync(payload, cancellationToken);

        return Ok(new SubmissionResponse("Thanks! Your scheduling request has been received. We will send a confirmation message to your email."));
    }

    [HttpPost("billing")]
    public async Task<IActionResult> SubmitBilling([FromBody] BillingRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Received billing support request for {Email}", request.Email);

        var payload = new MakeWebhookPayload
        {
            InquiryType = "billing",
            UserEmail = request.Email,
            UserName = request.Name,
            OwnerEmail = "owner@yourdomain.com",
            Subject = "Billing support request",
            Message = request.Message,
            Reference = request.Reference,
            Amount = request.Amount,
            Topic = request.Topic,
        };

        await _makeWebhookService.SendAsync(payload, cancellationToken);

        return Ok(new SubmissionResponse("Thanks! Your billing support request has been received. We will send a confirmation message to your email."));
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
