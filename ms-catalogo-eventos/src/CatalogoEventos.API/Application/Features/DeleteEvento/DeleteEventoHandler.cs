using CatalogoEventos.API.Domain.Interfaces;

namespace CatalogoEventos.API.Application.Features.DeleteEvento;

public class DeleteEventoHandler(IEventoRepository repository)
{
    public async Task HandleAsync(string id) => await repository.DeleteAsync(id);
}
