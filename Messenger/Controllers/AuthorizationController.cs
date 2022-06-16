using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Messenger.Models;
using System.Text;
using System.Security.Cryptography;

namespace Messenger.Controllers
{
    public class AuthorizationController : Controller
    {
        ApplicationContext db;

        public AuthorizationController(ApplicationContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult NotExist()
        {
            return View("NotExist");
        }

        [HttpPost]
        public async Task<IActionResult> Index(string login, string password)
        {
            login = Hash(login);
            password = Hash(password);

            if (login != null && password != null)
            {
                User? user = await db.Users.FirstOrDefaultAsync(p => p.Login == login && p.Password == password);
                if (user != null)
                {
                    HttpContext.Response.Cookies.Append("User", $"{login} {password}");

                    return RedirectToAction("Index", "Main");
                }
            }

            return NotExist();
        }

        public string Hash(string data)
        {
            byte[] enc = Encoding.Default.GetBytes(data);
            SHA1 sha = new SHA1CryptoServiceProvider();
            byte[] result = sha.ComputeHash(enc);
            data = Convert.ToBase64String(result);
            return data;
        }
    }
}