namespace Pedidos.API.Domain.Entities;

public class Pedido
{
    public int Id { get; set; }
    public string EventoId { get; set; } = string.Empty;
    public string ClienteNome { get; set; } = string.Empty;
    public string ClienteEmail { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = "Pendente";
    public DateTime DataPedido { get; set; } = DateTime.UtcNow;
}
