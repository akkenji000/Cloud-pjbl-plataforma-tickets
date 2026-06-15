using Pedidos.API.Domain.Interfaces;

namespace Pedidos.API.Application.Features.UpdatePedido;

public class UpdatePedidoHandler(IPedidoRepository repository)
{
    public async Task HandleAsync(int id, UpdatePedidoRequest request)
    {
        var existing = await repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Pedido {id} não encontrado");
        existing.EventoId = request.EventoId; existing.ClienteNome = request.ClienteNome;
        existing.ClienteEmail = request.ClienteEmail; existing.Quantidade = request.Quantidade;
        existing.ValorTotal = request.ValorTotal; existing.Status = request.Status;
        await repository.UpdateAsync(existing);
    }
}
