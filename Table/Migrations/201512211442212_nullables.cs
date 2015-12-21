namespace Table.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nullables : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Line", new[] { "Date" });
            AlterColumn("dbo.Line", "Date", c => c.DateTime());
            CreateIndex("dbo.Line", "Date");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Line", new[] { "Date" });
            AlterColumn("dbo.Line", "Date", c => c.DateTime(nullable: false));
            CreateIndex("dbo.Line", "Date");
        }
    }
}
