using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace Table.Data
{
	public class TableContext : DbContext
	{
		public TableContext() : base(typeof(TableContext).Name)
		{
		}

		public DbSet<Line> Lines { get; set; }

		protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
			modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
		}
	}
}