using Microsoft.AspNetCore.Mvc;
using Pedidos.API.Application.Features.CreatePedido;
using Pedidos.API.Application.Features.GetPedido;
using Pedidos.API.Application.Features.GetAllPedidos;
using Pedidos.API.Application.Features.UpdatePedido;
using Pedidos.API.Application.Features.DeletePedido;

namespace Pedidos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController(
    CreatePedidoHandler createHandler,
    GetPedidoHandler getHandler,
    GetAllPedidosHandler getAllHandler,
    UpdatePedidoHandler updateHandler,
    DeletePedidoHandler deleteHandler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await getAllHandler.HandleAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await getHandler.HandleAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePedidoRequest request)
    {
        var result = await createHandler.HandleAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePedidoRequest request)
    {
        await updateHandler.HandleAsync(id, request);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await deleteHandler.HandleAsync(id);
        return NoContent();
    }
}
