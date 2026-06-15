using Microsoft.EntityFrameworkCore;
using Pedidos.API.Infrastructure.Persistence;
using Pedidos.API.Infrastructure.Repositories;
using Pedidos.API.Domain.Interfaces;
using Pedidos.API.Application.Features.CreatePedido;
using Pedidos.API.Application.Features.GetPedido;
using Pedidos.API.Application.Features.GetAllPedidos;
using Pedidos.API.Application.Features.UpdatePedido;
using Pedidos.API.Application.Features.DeletePedido;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "MS Pedidos", Version = "v1" }));

var connStr = builder.Configuration.GetConnectionString("SqlServer")
    ?? "Server=localhost,1433;Database=pedidos_db;User=sa;Password=SuperSecretPassword123!;TrustServerCertificate=True";

builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(connStr));
builder.Services.AddScoped<IPedidoRepository, PedidoRepository>();
builder.Services.AddScoped<CreatePedidoHandler>();
builder.Services.AddScoped<GetPedidoHandler>();
builder.Services.AddScoped<GetAllPedidosHandler>();
builder.Services.AddScoped<UpdatePedidoHandler>();
builder.Services.AddScoped<DeletePedidoHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();

public partial class Program { }
