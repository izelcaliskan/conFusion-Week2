import { Component, Inject, OnInit } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from './animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display:block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leader?: Leader;
  leaders?: Leader[];
  leaderErrMess?: string;

  constructor(private leaderService: LeaderService,
    @Inject('BaseURL') public baseURL: string) {
    leaderService.getLeaders().subscribe(leaders => this.leaders = leaders);


  }

  ngOnInit(): void {
    this.leaderService.getFeaturedLeader()
      .subscribe(leader => this.leader = leader,
        errmess => this.leaderErrMess = <any>errmess);



  }

}
