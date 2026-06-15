using CatalogoEventos.API.Application.Features.GetEvento;
using CatalogoEventos.API.Domain.Interfaces;

namespace CatalogoEventos.API.Application.Features.GetAllEventos;

public class GetAllEventosHandler(IEventoRepository repository)
{
    public async Task<List<GetEventoResponse>> HandleAsync()
    {
        var eventos = await repository.GetAllAsync();
        return eventos.Select(e => new GetEventoResponse(e.Id!, e.Nome, e.Data,
            e.Local, e.Capacidade, e.PrecoBase, e.Categoria, e.Status)).ToList();
    }
}
