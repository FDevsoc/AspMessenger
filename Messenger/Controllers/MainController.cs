using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Messenger.Models;

namespace Messenger.Controllers
{
    public class MainController : Controller
    {
        private ApplicationContext db;
        private User? _user;

        public MainController(ApplicationContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            // Получаем авторизованного пользователя
            GetUser();

            // Выводим данные
            ViewData["User"] = _user.Name;

            var messages = (from m in db.Messages
                            where _user.Id == m.SenderId || _user.Id == m.ReceiverId
                            select m).ToList();

            ViewBag.Messages = messages.ToList();

            var dialogs = (from m in messages
                           select m.DialogId).ToList();

            ViewBag.Dialogs = dialogs.Distinct().ToList();

            return View();
        }

        public void GetUser()
        {
            var authString = HttpContext.Request.Cookies["User"];

            string[] dataList = authString.Split(' ');

            var login = dataList[0];
            var password = dataList[1];

            _user = db.Users.FirstOrDefault(p => p.Login == login && p.Password == password);
        }
    }
}
