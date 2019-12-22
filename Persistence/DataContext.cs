using System;
using Domain;
using Microsoft.EntityFrameworkCore;
/*
 Realizar la instalación desde la paquetería nuget de Microsoft.EntityFrameworkCore ysqlite
 para el Dbcontext
*/

namespace Persistence
{
    public class DataContext: DbContext
    {
        //Creamos el contexto para los datos
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        //Añadimos las propiedades de los valores para ver y modificar
        public DbSet<Value> Values { get; set; }

        // Añadimos la referencia de las propiedaes para que al realizar la migración se genere la base de datos
        public DbSet<Activity> Activities {get; set;}
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
            .HasData(
                new Value {Id=1, Name="Value 101"},
                new Value {Id=2, Name="Value 102"},
                new Value {Id=3, Name="Value 103"}
            );
        }
    }
}
