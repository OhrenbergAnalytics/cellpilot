<script lang="ts" module>
  import Settings2Icon from "@lucide/svelte/icons/settings-2";
  import user from "$lib/assets/account.svg"
  import configurator from "$lib/assets/configurator.svg"
  import database from "$lib/assets/database.svg"
  import sales from "$lib/assets/sales.svg"


  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: user,
    },
    navMain: [
      {
        title: "Pack Designer",
        url: "/configurator",
        icon: configurator,
        isActive: true,
        items: [
          {
            title: "Design Pack",
            url: "#",
          },
          {
            title: "Integration",
            url: "/configurator/integration",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Inquiries",
        url: "/inquiries",
        icon: sales,
      },
      {
        title: "Cell Database",
        url: "/celldatabase",
        icon: database,
        items: [
          {
            title: "Compare Cells",
            url: "#",
          },
          {
            title: "Add new Cell",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2Icon,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Account",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
        ],
      },
    ],
   
  };
</script>
<script lang="ts">
  import NavMain from "./nav-main.svelte";
  import NavUser from "./nav-user.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";
  import Logo from '$lib/assets/logo.svg';
  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>
<Sidebar.Root bind:ref variant="inset" {...restProps}>
    
  <Sidebar.Header class="px-4 py-3">
    <a href="/" class="block">
      <img src={Logo} alt="Logo" class="h-6" />
    </a>
  </Sidebar.Header>

  <Sidebar.Content>
    <NavMain items={data.navMain} />
  </Sidebar.Content>
  
  <Sidebar.Footer>
    <NavUser user={data.user} />
  </Sidebar.Footer>
</Sidebar.Root>