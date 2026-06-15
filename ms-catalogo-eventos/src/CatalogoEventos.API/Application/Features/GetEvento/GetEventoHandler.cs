using CatalogoEventos.API.Domain.Interfaces;

namespace CatalogoEventos.API.Application.Features.GetEvento;

public class GetEventoHandler(IEventoRepository repository)
{
    public async Task<GetEventoResponse?> HandleAsync(string id)
    {
        var e = await repository.GetByIdAsync(id);
        if (e is null) return null;
        return new GetEventoResponse(e.Id!, e.Nome, e.Data, e.Local,
            e.Capacidade, e.PrecoBase, e.Categoria, e.Status);
    }
}
