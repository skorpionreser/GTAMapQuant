using GTAMapQuant.DAL.Data;
using Microsoft.EntityFrameworkCore;
using GTAMapQuant.BLL.DTO.MapMarkers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMediatR(config =>
    config.RegisterServicesFromAssembly(typeof(MapMarkerDto).Assembly));
builder.Services.AddDbContext<GtaMapDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

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
