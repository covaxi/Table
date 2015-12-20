using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Table.Data;

namespace Table.Models
{
	/// <summary>
	/// Galvanic isolation extensions
	/// </summary>
	public static class ModelExtensions
	{
		public static LineDTO ToDTO(this Line line)
		{
			return new LineDTO { Id = line.Id, Date = line.Date, Text = line.Text };
		}

		public static Line ToModel(this LineDTO line)
		{
			return new Line { Id = line.Id, Date = line.Date, Text = line.Text };
		}
	}
}