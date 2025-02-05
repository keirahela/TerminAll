export default function cal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let calendar = `     ${months[month]} ${year}\n`;
  calendar += weekdays.join(" ") + "\n";

  let currentDay = 1;
  let line = "   ".repeat(firstDay);

  for (let i = firstDay; i < 7; i++) {
    line += String(currentDay).padStart(3, " ") + " ";
    currentDay++;
  }

  calendar += line.trim() + "\n";

  while (currentDay <= daysInMonth) {
    line = "";
    for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
      line += String(currentDay).padStart(3, " ") + " ";
      currentDay++;
    }
    calendar += line.trim() + "\n";
  }

  return calendar.trim();
}
