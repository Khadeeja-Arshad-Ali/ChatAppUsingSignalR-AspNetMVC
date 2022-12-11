using Microsoft.AspNetCore.SignalR;

namespace ChatAppUsingSignalR_AspNetMVC.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string username, string message)
        {
            Clients.All.SendAsync("RecieveMessage", username,message);
        }
    }
}
