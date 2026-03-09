using NSwag.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// OpenAPI / Swagger (NSwag)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();

// Enable CORS for any origin (demo/testing purposes)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseOpenApi();
app.UseSwaggerUi();

app.MapControllers();

app.Run();
