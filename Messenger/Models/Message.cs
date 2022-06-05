namespace Messenger.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public DateTime SendDate { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int DialogId { get; set; }
        public Dialog? Dialog { get; set; }
    }
}
