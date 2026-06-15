using Pedidos.API.Domain.Interfaces;

namespace Pedidos.API.Application.Features.DeletePedido;

public class DeletePedidoHandler(IPedidoRepository repository)
{
    public async Task HandleAsync(int id) => await repository.DeleteAsync(id);
}
