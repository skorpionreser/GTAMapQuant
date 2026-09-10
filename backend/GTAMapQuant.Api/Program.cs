using FluentValidation;
using GTAMapQuant.Api.ExceptionHandlers;
using GTAMapQuant.BLL.MediatR.Behaviors;
using GTAMapQuant.DAL.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var currentAssemblies = AppDomain.CurrentDomain.GetAssemblies();
var bllAssembly = typeof(ValidationBehavior<,>).Assembly;

builder.Services.AddValidatorsFromAssembly(bllAssembly);
builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssemblies(currentAssemblies);
    config.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

builder.Services.AddDbContext<GtaMapDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
