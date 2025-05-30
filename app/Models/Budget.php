<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Budget extends Model
{
    //
    use HasUuids;
    use SoftDeletes;

    protected $dates = [
        'deleted_at',
    ];
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
