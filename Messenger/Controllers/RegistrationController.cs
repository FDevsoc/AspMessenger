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
    public class RegistrationController : Controller
    {
        ApplicationContext db;

        public RegistrationController(ApplicationContext context)
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
        public async Task<IActionResult> Index(User user)
        {
            user.Login = Hash(user.Login);
            user.Password = Hash(user.Password);

            if (await db.Users.FirstOrDefaultAsync(p => p.Name == user.Name || p.Login == user.Login) == null)
            {
                db.Users.Add(user);
                await db.SaveChangesAsync();

                HttpContext.Response.Cookies.Append("User", $"{user.Login} {user.Password}");
                return RedirectToAction("Index", "Main");
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