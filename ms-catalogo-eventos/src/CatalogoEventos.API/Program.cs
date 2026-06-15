using CatalogoEventos.API.Infrastructure.Persistence;
using CatalogoEventos.API.Infrastructure.Repositories;
using CatalogoEventos.API.Domain.Interfaces;
using CatalogoEventos.API.Application.Features.CreateEvento;
using CatalogoEventos.API.Application.Features.GetEvento;
using CatalogoEventos.API.Application.Features.GetAllEventos;
using CatalogoEventos.API.Application.Features.UpdateEvento;
using CatalogoEventos.API.Application.Features.DeleteEvento;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "MS Catálogo de Eventos", Version = "v1" }));

builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<IEventoRepository, EventoRepository>();
builder.Services.AddScoped<CreateEventoHandler>();
builder.Services.AddScoped<GetEventoHandler>();
builder.Services.AddScoped<GetAllEventosHandler>();
builder.Services.AddScoped<UpdateEventoHandler>();
builder.Services.AddScoped<DeleteEventoHandler>();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();

public partial class Program { }
