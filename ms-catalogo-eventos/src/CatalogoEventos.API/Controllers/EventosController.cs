using Microsoft.AspNetCore.Mvc;
using CatalogoEventos.API.Application.Features.CreateEvento;
using CatalogoEventos.API.Application.Features.GetEvento;
using CatalogoEventos.API.Application.Features.GetAllEventos;
using CatalogoEventos.API.Application.Features.UpdateEvento;
using CatalogoEventos.API.Application.Features.DeleteEvento;

namespace CatalogoEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventosController(
    CreateEventoHandler createHandler,
    GetEventoHandler getHandler,
    GetAllEventosHandler getAllHandler,
    UpdateEventoHandler updateHandler,
    DeleteEventoHandler deleteHandler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await getAllHandler.HandleAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await getHandler.HandleAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEventoRequest request)
    {
        var result = await createHandler.HandleAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateEventoRequest request)
    {
        await updateHandler.HandleAsync(id, request);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await deleteHandler.HandleAsync(id);
        return NoContent();
    }
}
