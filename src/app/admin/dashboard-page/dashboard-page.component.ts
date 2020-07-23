import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { PostsService } from 'src/app/shared/posts.service';
import {Post} from "../../shared/intrerfaces"
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  constructor(private auth: AuthService, public postSerive: PostsService, private alert: AlertService) { }
  public posts: Post[] = [];
  pSub: Subscription
  dSun: Subscription
  searchStr: string = "";
  ngOnInit() {
    this.pSub =this.postSerive.getAll().subscribe(posts=>{
      this.posts = posts
    })

  }
  ngOnDestroy(){
    if(this.pSub){
      this.pSub.unsubscribe()
    }
    if(this.dSun){
      this.dSun.unsubscribe()
    }
  }
  remove(id:string){
    this.dSun = this.postSerive.remove(id).subscribe(()=>{
      this.posts = this.posts.filter(post=>post.id!==id)
      this.alert.danger("Пост был хакамада")
    })
  }
}
