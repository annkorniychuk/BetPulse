using Microsoft.EntityFrameworkCore;

using SportsPlatform.Data;

using SportsPlatform.Services;

using Microsoft.IdentityModel.Tokens;

using System.Text;



var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

//builder.Services.AddEndpointsApiExplorer();







var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")

    ?? throw new InvalidOperationException("Connection string not found");



builder.Services.AddDbContext<AppDbContext>(options =>

{

    options.UseNpgsql(connectionString);

});



builder.Services.AddScoped<SportService>();

builder.Services.AddScoped<CompetitionService>();



// Налаштування Аутентифікації (JWT) 

builder.Services.AddAuthentication().AddJwtBearer(options =>

{

    options.TokenValidationParameters = new TokenValidationParameters

    {

        ValidateIssuerSigningKey = true,

        ValidateAudience = false,

        ValidateIssuer = false,

        IssuerSigningKey = new SymmetricSecurityKey(

            Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!))

    };

});
builder.Services.AddScoped<PromotionService>();

builder.Services.AddScoped<BetService>();



builder.Services.AddOpenApi();



var app = builder.Build();



app.MapOpenApi();



app.UseSwaggerUI(options =>

{

    options.SwaggerEndpoint("/openapi/v1.json", "v1");

    options.OAuthUsePkce();

});