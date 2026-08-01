using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MedicalVaApi.Services;

public interface IMakeWebhookService
{
    Task<bool> SendAsync(MakeWebhookPayload payload, CancellationToken cancellationToken = default);
}

public sealed class MakeWebhookService : IMakeWebhookService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<MakeWebhookService> _logger;

    public MakeWebhookService(HttpClient httpClient, IConfiguration configuration, ILogger<MakeWebhookService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendAsync(MakeWebhookPayload payload, CancellationToken cancellationToken = default)
    {
        var webhookUrl = _configuration["MakeWebhookUrl"] ?? Environment.GetEnvironmentVariable("MAKE_WEBHOOK_URL");
        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            _logger.LogWarning("Make webhook URL is not configured.");
            return false;
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, webhookUrl)
        {
            Content = JsonContent.Create(payload, options: new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            })
        };

        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        try
        {
            var response = await _httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Make webhook returned {StatusCode}.", response.StatusCode);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to deliver submission to Make webhook.");
            return false;
        }
    }
}

public sealed class MakeWebhookPayload
{
    [JsonPropertyName("inquiry_type")]
    public string InquiryType { get; init; } = string.Empty;

    [JsonPropertyName("calendar_provider")]
    public string? CalendarProvider { get; init; }

    [JsonPropertyName("user_email")]
    public string? UserEmail { get; init; }

    [JsonPropertyName("user_name")]
    public string? UserName { get; init; }

    [JsonPropertyName("owner_email")]
    public string? OwnerEmail { get; init; }

    [JsonPropertyName("subject")]
    public string? Subject { get; init; }

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("start_time")]
    public string? StartTime { get; init; }

    [JsonPropertyName("end_time")]
    public string? EndTime { get; init; }

    [JsonPropertyName("timezone")]
    public string? Timezone { get; init; }

    [JsonPropertyName("reference")]
    public string? Reference { get; init; }

    [JsonPropertyName("amount")]
    public string? Amount { get; init; }

    [JsonPropertyName("topic")]
    public string? Topic { get; init; }
}
