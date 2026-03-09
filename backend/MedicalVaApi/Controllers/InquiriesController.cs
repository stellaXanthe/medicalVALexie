using Microsoft.AspNetCore.Mvc;

namespace MedicalVaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly ILogger<InquiriesController> _logger;

    public InquiriesController(ILogger<InquiriesController> logger)
    {
        _logger = logger;
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

        return CreatedAtAction(nameof(Get), new { id = inquiry.Id }, inquiry);
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
}
