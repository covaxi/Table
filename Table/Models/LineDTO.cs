using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Table.Models
{
	/// <summary>
	/// Строка таблицы
	/// </summary>
	public class LineDTO
	{
		/// <summary>
		/// Id
		/// </summary>
		public int Id { get; set; }
		/// <summary>
		/// Дата
		/// </summary>
		public DateTime? Date { get; set; }
		/// <summary>
		/// Набор различных букв и символов
		/// </summary>
		public string Text { get; set; }
	}
}
