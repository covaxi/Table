using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Table.Data;
using Table.Models;

namespace Table.Controllers
{
	public class ValuesController : ApiController
	{
		/// <summary>
		/// Get list filtered by date
		/// </summary>
		/// <param name="start">Start date</param>
		/// <param name="end">End date</param>
		/// <returns>List of TableLIne objects</returns>
		public IEnumerable<LineDTO> Get(DateTime? start = null, DateTime? end = null)
		{
			try
			{


				var res = DB.Execute(db =>
				{
					start = start?.Date;
					end = end?.Date.AddDays(1);
					return db.Lines
						.Get(line => (start == null || line.Date >= start) && (end == null || line.Date <= end))
						.ToList()
						.Select(l => l.ToDTO());
				});
				Console.WriteLine(res);
				return res;
			}
			catch(Exception ex)
			{
				Console.WriteLine(ex);
			}
			return null;
		}

		/// <summary>
		/// Add new object
		/// </summary>
		/// <returns>Created object</returns>
		public LineDTO Post()
		{
			return DB.Execute(db =>
			{
				var line = db.Lines.Add();
				db.SaveChanges();
				return line.ToDTO();
			});
		}

		/// <summary>
		/// Modify object 
		/// </summary>
		/// <param name="id">Id of the object</param>
		/// <param name="modified">Modified object.</param>
		public void Put(int id, [FromBody]LineDTO modified)
		{
			if (id != modified.Id)
				// throw new Exception("Тревога тревога волк унёс зайчат");
				throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Conflict));

			DB.Execute(db =>
			{
				db.Lines.Update(modified.ToModel());
				db.SaveChanges();
			});
		}

		/// <summary>
		/// Delete object
		/// </summary>
		/// <param name="id">Id of the object</param>
		public void Delete(int id)
		{
			DB.Execute(db =>
			{
				db.Lines.Delete(id);
				db.SaveChanges();
			});
		}
	}
}
