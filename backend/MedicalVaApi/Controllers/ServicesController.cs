using Microsoft.AspNetCore.Mvc;

namespace MedicalVaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<ServiceInfo>> Get()
    {
        var services = new[]
        {
            new ServiceInfo("Scheduling", "Book, manage, and update appointments."),
            new ServiceInfo("Billing Support", "Help with invoices, payments, and insurance."),
        };

        return Ok(services);
    }

    public record ServiceInfo(string Name, string Description);
}
