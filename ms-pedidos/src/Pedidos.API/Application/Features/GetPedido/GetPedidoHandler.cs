using Pedidos.API.Domain.Interfaces;

namespace Pedidos.API.Application.Features.GetPedido;

public class GetPedidoHandler(IPedidoRepository repository)
{
    public async Task<GetPedidoResponse?> HandleAsync(int id)
    {
        var p = await repository.GetByIdAsync(id);
        if (p is null) return null;
        return new GetPedidoResponse(p.Id, p.EventoId, p.ClienteNome, p.ClienteEmail,
            p.Quantidade, p.ValorTotal, p.Status, p.DataPedido);
    }
}
