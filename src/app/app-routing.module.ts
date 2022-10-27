import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizePageComponent } from './_component/share/localize-page/localize-page.component';

import { HomeComponent } from './_component/page/home/home.component';
import { NewsComponent } from './_component/page/news/news.component';
import { RegisterComponent } from './_component/page/register/register.component';
import { DownloadComponent } from './_component/page/download/download.component';

const routes: Routes = [
  {
    path: 'play', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Play:Play`, page: 'play',
      desc: $localize`:meta-description-play:Play RPG MO for free and join the awesome community.`
    }
  },
  {
    path: 'media', loadChildren: () => import('./_component/page/media/media.module').then(m => m.MediaModule),
    data: {
      title: $localize`:@@Media:Media`,
      desc: $localize`:meta-description-media:RPG MO screenshots, videos and music.`
    }
  },
  {
    path: 'highscore', loadChildren: () => import('./_component/page/highscore/highscore.module').then(m => m.HighscoreModule),
    data: {
      title: $localize`:@@Highscore:Highscore`,
      desc: $localize`:meta-description-highscore:See who are the best players in RPG MO.`
    }
  },
  {
    path: 'news', component: NewsComponent,
    data: {
      title: $localize`:@@News:News`,
      desc: $localize`:meta-description-news:Latest news and updates to RPG MO`
    }
  },
  {
    path: 'credits', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Credits:Credits`, page: 'credits',
      desc: $localize`:meta-description-credits:People behind the making of RPG MO`
    }
  },
  {
    path: 'register', component: RegisterComponent,
    data: {
      title: $localize`:@@Register:Register`,
      desc: $localize`:meta-description-register:Create an account and start enjoying the free MMORPG called RPG MO`
    }
  },
  {
    path: 'contact', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Contact:Contact`, page: 'contact',
      desc: $localize`:meta-description-contact:Need to contact us? This is the page to contact creators of RPG MO.`
    }
  },
  {
    path: 'download', component: DownloadComponent,
    data: {
      title: $localize`:@@Download:Download`,
      desc: $localize`:meta-description-download:Download standalone applications for Windows, Mac, Linux, Android`
    }
  },
  {
    path: 'forum', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Forum:Forum`, page: 'forum',
      desc: $localize`:meta-description-forum:Join the RPG MO community.`
    }
  },
  {
    path: 'wiki', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Wiki:Wiki`, page: 'wiki',
      desc: $localize`:meta-description-wiki:RPG MO wiki and information`
    }
  },
  {
    path: 'rules', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Game rules:Game rules`, page: 'rules',
      desc: $localize`:meta-description-rules:Read about RPG MO's game rules.`
    }
  },
  {
    path: 'chatrules', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Chat rules:Chat rules`, page: 'chatrules',
      desc: $localize`:meta-description-chatrules:Read about RPG MO's chat rules.`
    }
  },
  {
    path: 'privacy', component: LocalizePageComponent,
    data: {
      title: $localize`:@@Privacy Policy:Privacy Policy`, page: 'privacy',
      desc: $localize`:meta-description-privacy:Read about RPG MO's privacy policy.`
    }
  },
  { path: '', component: HomeComponent, data: { title: $localize`:@@Free MMORPG:Free MMORPG` } },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'top',
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled',
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
