using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace Table.Data
{
	public class Repository<T, TKey> 
		where T : class, IHasKey<TKey>, new()
	{
		protected TableContext db { get; }

		public Repository(TableContext db)
		{
			this.db = db;
		}

		public T Get(TKey id)
		{
			return db.Set<T>().Find(id);
		}

		public IEnumerable<T> Get(Expression<Func<T, bool>> where)
		{
			return db.Set<T>().Where(where);
		}

		public void Update(T t)
		{
			var existing = db.Set<T>().Find(t.Id);
			if (existing != null)
			{
				var entry = db.Entry<T>(existing);
				entry.CurrentValues.SetValues(t);
				entry.State = EntityState.Modified;
			}
			else throw new InvalidOperationException();
		}

		public void Delete(TKey id)
		{
			var existing = db.Set<T>().Find(id);
			if (existing != null)
			{
				db.Set<T>().Remove(existing);
			}
			else throw new InvalidOperationException();
		}

		public T Add()
		{
			var t = db.Set<T>().Add(new T());
			return t;
		}

	}
}