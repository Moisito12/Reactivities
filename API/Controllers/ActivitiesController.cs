using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Agregamos un controlador base por que no necesitamos soporte visual
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;
        // Con esto accesaos al data context para los datos
        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Este es el método para accesar a los valores de las actividades con las peticiones http
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List(CancellationToken ct)
        {
            return await _mediator.Send(new List.Query(), ct);
        }
        // Es necesario agregar el servicio en el startup.cs

        // Método para obetener el detalle de una sola actividad identificada por el id
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id)
        {
            return await _mediator.Send(new Details.Query{Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromBody]Create.Command command)
        {
            return await _mediator.Send(command);
        }

        // Método para editar las actividades, es necesario pasar el id
        // ya que con eso identificará la actividad a actualizar
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new Delete.Command{Id=id});
        }

    }
}