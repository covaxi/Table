using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using Table.Data;

namespace Table.Data
{
	public class DB
	{
		private TableContext ctx { get; }

		private DB(TableContext ctx)
		{
			this.ctx = ctx;
			this.Lines = new Repository<Line, int>(ctx);
		}

		public Repository<Line, int> Lines;

		public void SaveChanges() => ctx.SaveChanges();

		public static TResult Execute<TResult>(Func<DB, TResult> lambda) 
		{
			using (var ctx = new TableContext())
			{
				var db = new DB(ctx);
				return lambda(db);
			}
		}

		public static void Execute(Action<DB> lambda) => Execute(db => { lambda(db); return 17; });
	}
}