namespace CatalogoEventos.API.Application.Features.UpdateEvento;

public record UpdateEventoRequest(
    string Nome, DateTime Data, string Local,
    int Capacidade, decimal PrecoBase, string Categoria, string Status);
