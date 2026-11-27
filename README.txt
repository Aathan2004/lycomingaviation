LYCOMING AVIATION – OFFICIAL WEBSITE
====================================
Pages: index (Home), about, courses, countries, careers, gallery, contact
Shared design: assets/style.css   Shared behaviour: assets/main.js

1) SET THE WHATSAPP NUMBER
   Done: set to 918925850808 (+91 89258 50808) in assets/main.js and index.html.
   assets/main.js, first line:  const WHATSAPP_NUMBER = "918925850808";
   (country code + number, digits only)

2) REPLACE PLACEHOLDERS (search all files for "[" )
   Phone set to +91 89258 50808 (calls and WhatsApp).
   [Mon–Sat, 9:30 AM – 6:30 PM]  -> real office hours
   [On request]       -> Cadet prep fees (or leave as is)

3) ADD PHOTOS  -> put files in assets/photos/ with EXACTLY these names
   (any slot without a file shows a neat purple placeholder)
   home-training.jpg   Home "Why Lycoming" photo
   g01.jpg ... g12.jpg Gallery (g01–g03 also show on Home)
   about-team.jpg      About page story photo
   founder.jpg         Founder (Sai Prasanth G)
   event-2024.jpg, event-ajk.jpg, event-expo.jpg   Events
   course-ground.jpg, course-cabin.jpg, course-groundstaff.jpg, course-nios.jpg, course-cadet.jpg
   ranker-01.jpg ... ranker-05.jpg   Home "DGCA results" student photos (portrait, ~800px tall)
   country-india.jpg (ASET Thoothukudi), country-uae.jpg, country-australia.jpg, country-germany.jpg,
   country-south-africa.jpg, country-philippines.jpg, country-canada.jpg, country-usa.jpg
   careers.jpg
   Tip: resize photos to ~1600px wide, under 400 KB each.

4) ADD VIDEOS  -> assets/video/
   hero.mp4            Home page background (short, silent, under ~8 MB)
   v1.mp4 v2.mp4 v3.mp4  Gallery videos (compress to under ~15 MB each)
   Big phone videos (100–300 MB) are too heavy for a website: compress first,
   or upload to YouTube/Instagram and link them.

5) LAUNCH DAY
   Delete this line from the top of EVERY .html file:
   <meta name="robots" content="noindex, nofollow"><!-- REMOVE this line on launch day -->

6) HOME PAGE PLACEHOLDERS TO FILL
   assets/home.js (top of file):
     RANKERS       -> student name, DGCA paper, score, photo file (add/remove lines freely)
     TESTIMONIALS  -> student name, course/result, review text
   index.html:
     [4.9] and [Google profile link] in the "What our students say" section
     WhatsApp number: the WHATSAPP_NUMBER line near the bottom of index.html
       (the other pages use assets/main.js; set both)
   Fees still "On request": Airport Ground Staff, NIOS assistance, Cadet prep, type rating.
   Country costs show "Costs on request" until real figures are given.
