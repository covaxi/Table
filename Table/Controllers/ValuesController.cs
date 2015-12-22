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

		/// <summary>
		/// Add new object
		/// </summary>
		/// <returns>Created object</returns>
		public IEnumerable<ActionResult> Post(IEnumerable<ActionDTO> actions)
		{
			return DB.Execute(db =>
			{
				var dict = new Dictionary<int, Line>();
				foreach (var value in actions.GroupBy(a => a.Id).Select(SimplifyOperations))
				{
					switch(value.ActionType)
					{
						case ActionType.Delete:
							db.Lines.Delete(value.Id);
							break;
						case ActionType.Add:
							{
								var line = db.Lines.Add();
								line.Text = value.Text;
								line.Date = value.Date;
								dict[value.Id] = line;
								break;
							}
						case ActionType.Modify:
							{
								var line = db.Lines.Get(value.Id);
								line.Text = value.Text;
								line.Date = value.Date;
								break;
							}
						default:
							throw new HttpResponseException(HttpStatusCode.BadRequest);
					}
				}
				db.SaveChanges();
				return dict.Select(kv => new ActionResult { OldId = kv.Key, NewId = kv.Value.Id });
			});
		}

		private ActionDTO SimplifyOperations(IGrouping<int, ActionDTO> g)
		{
			ActionDTO result;
			if (g.Any(a => a.ActionType == ActionType.Delete && g.Key > 0))
				result = new ActionDTO { Id = g.Key, ActionType = ActionType.Delete };
			else if (g.Any(a => a.ActionType == ActionType.Add && g.Key < 0))
			{
				var last = g.LastOrDefault(a => a.ActionType == ActionType.Modify);
				result = new ActionDTO { Id = g.Key, ActionType = ActionType.Add, Text = last.Text, Date = last.Date };
			}
			else if (g.Key > 0)
			{
				var last = g.Last(a => a.ActionType == ActionType.Modify);
				result = new ActionDTO { Id = g.Key, ActionType = ActionType.Modify, Text = last.Text, Date = last.Date };
			}
			else
				throw new HttpResponseException(HttpStatusCode.BadRequest);
			return result;
		}
	}
}
