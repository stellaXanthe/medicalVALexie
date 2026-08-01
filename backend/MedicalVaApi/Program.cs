using NSwag.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient<MedicalVaApi.Services.IMakeWebhookService, MedicalVaApi.Services.MakeWebhookService>();

// OpenAPI / Swagger (NSwag)
builder.Services.AddOpenApiDocument();

// HTTP client for external calls (Langflow, etc.)
builder.Services.AddHttpClient();

// CORS Configuration - Allow your Vercel frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://medical-va-lexie-ns94.vercel.app",           // Main production domain
            "https://medical-va-lexie-ns94-git-main-stellaxanthes-projects.vercel.app", // Preview branch
            "http://localhost:3000"                                // Local development
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

// CORS must come before authorization and controllers
app.UseCors("AllowFrontend");

app.UseOpenApi();
app.UseSwaggerUi();

app.UseAuthorization();

app.MapControllers();

app.Run();