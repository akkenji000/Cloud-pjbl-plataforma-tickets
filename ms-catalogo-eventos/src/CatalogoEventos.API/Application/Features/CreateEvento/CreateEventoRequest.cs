namespace CatalogoEventos.API.Application.Features.CreateEvento;

public record CreateEventoRequest(
    string Nome, DateTime Data, string Local,
    int Capacidade, decimal PrecoBase, string Categoria);
