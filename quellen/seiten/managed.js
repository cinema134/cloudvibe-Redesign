/* Managed Services: Sprungmarke (#backup, #infrastruktur, #hardware, #security) öffnet den passenden Bereich */
(function () {
  const auf = () => { const d = location.hash && document.querySelector('details' + location.hash); if (d) { d.open = true; d.scrollIntoView({ block: 'start' }); } };
  auf(); window.addEventListener('hashchange', auf);
})();
