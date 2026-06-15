using Microsoft.EntityFrameworkCore;
using Pedidos.API.Domain.Entities;
using Pedidos.API.Domain.Interfaces;
using Pedidos.API.Infrastructure.Persistence;

namespace Pedidos.API.Infrastructure.Repositories;

public class PedidoRepository(AppDbContext context) : IPedidoRepository
{
    public async Task<List<Pedido>> GetAllAsync() => await context.Pedidos.ToListAsync();

    public async Task<Pedido?> GetByIdAsync(int id) => await context.Pedidos.FindAsync(id);

    public async Task<Pedido> CreateAsync(Pedido pedido)
    {
        context.Pedidos.Add(pedido);
        await context.SaveChangesAsync();
        return pedido;
    }

    public async Task UpdateAsync(Pedido pedido)
    {
        context.Entry(pedido).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var pedido = await context.Pedidos.FindAsync(id);
        if (pedido is not null)
        {
            context.Pedidos.Remove(pedido);
            await context.SaveChangesAsync();
        }
    }
}
