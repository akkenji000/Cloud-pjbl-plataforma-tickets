namespace CatalogoEventos.API.Application.Features.CreateEvento;

public record CreateEventoResponse(
    string Id, string Nome, DateTime Data, string Local,
    int Capacidade, decimal PrecoBase, string Categoria, string Status);
