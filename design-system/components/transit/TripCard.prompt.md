# TripCard

The trip-alternative card in the results sheet. Shows the whole journey as a leg sequence — colored bus route chips and walk segments — then total minutes and fare, so it reads without a second look. `recommended` gives the green hero style for the fastest option.

```jsx
<TripCard
  recommended
  legs={[
    { type: "walk", minutes: 4 },
    { type: "bus", route: "30B", color: "var(--route-1)" },
    { type: "bus", route: "7D", color: "var(--route-6)" },
  ]}
  totalMinutes={42}
  fare="$0.50"
  departLabel="Sale en 3 min · cada 12 min"
/>
```

Transfers are derived from the number of bus legs. Stack 2–4 in a `BottomSheet`, ordered by time.
