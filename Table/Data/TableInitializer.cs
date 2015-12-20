using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Table.Data
{
	public class TableInitializer : DropCreateDatabaseIfModelChanges<TableContext>
	{
		protected string GenerateText(int i)
		{
			return new[] { "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten" }[i];
		}

		protected override void Seed(TableContext context)
		{
			base.Seed(context);

			context.Lines.AddRange(Enumerable.Range(1, 10)
				.Select(i => new Line { Date = DateTime.Now.AddDays(i - 6), Text = GenerateText(i-1) }));

			context.SaveChanges();
		}
	}
}