namespace CatalogoEventos.API.Application.Features.GetEvento;

public record GetEventoResponse(
    string Id, string Nome, DateTime Data, string Local,
    int Capacidade, decimal PrecoBase, string Categoria, string Status);
