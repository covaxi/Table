namespace Table.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Line",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Text = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Date);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.Line", new[] { "Date" });
            DropTable("dbo.Line");
        }
    }
}
