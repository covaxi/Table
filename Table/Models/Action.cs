using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Table.Models
{
	public enum ActionType
	{
		Add,
		Delete,
		Modify
	}

	public class ActionResult
	{
		public int OldId { get; set; }
		public int NewId { get; set; }
	}

	public class ActionDTO
	{
		public ActionType ActionType { get; set; }
		public int Id { get; set; }
		public DateTime? Date { get; set; }
		public string Text { get; set; }
	}
}
